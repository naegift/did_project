import { getResolver as ethrDidResolver } from 'ethr-did-resolver';
import { getResolver as webDidResolver } from 'web-did-resolver';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { dynamicImport } from 'tsimportlib';

@Injectable()
export class VcService {
  async veramoImport() {
    const { createAgent } = (await dynamicImport(
      '@veramo/core',
      module,
    )) as typeof import('@veramo/core');
    const { DIDManager } = (await dynamicImport(
      '@veramo/did-manager',
      module,
    )) as typeof import('@veramo/did-manager');
    const { EthrDIDProvider } = (await dynamicImport(
      '@veramo/did-provider-ethr',
      module,
    )) as typeof import('@veramo/did-provider-ethr');
    const { KeyManager } = (await dynamicImport(
      '@veramo/key-manager',
      module,
    )) as typeof import('@veramo/key-manager');
    const { KeyManagementSystem, SecretBox } = (await dynamicImport(
      '@veramo/kms-local',
      module,
    )) as typeof import('@veramo/kms-local');
    const { CredentialPlugin } = (await dynamicImport(
      '@veramo/credential-w3c',
      module,
    )) as typeof import('@veramo/credential-w3c');
    const { DIDResolverPlugin } = (await dynamicImport(
      '@veramo/did-resolver',
      module,
    )) as typeof import('@veramo/did-resolver');
    const { Resolver } = (await dynamicImport(
      'did-resolver',
      module,
    )) as typeof import('did-resolver');
    const { Entities, DIDStore, KeyStore, PrivateKeyStore, migrations } =
      (await dynamicImport(
        '@veramo/data-store',
        module,
      )) as typeof import('@veramo/data-store');

    return {
      createAgent,
      DIDManager,
      EthrDIDProvider,
      KeyManager,
      KeyManagementSystem,
      SecretBox,
      CredentialPlugin,
      DIDResolverPlugin,
      Resolver,
      Entities,
      DIDStore,
      KeyStore,
      PrivateKeyStore,
      migrations,
    };
  }

  async getAgent() {
    const {
      createAgent,
      DIDManager,
      EthrDIDProvider,
      KeyManager,
      KeyManagementSystem,
      SecretBox,
      CredentialPlugin,
      DIDResolverPlugin,
      Resolver,
      Entities,
      DIDStore,
      KeyStore,
      PrivateKeyStore,
      migrations,
    } = await this.veramoImport();

    const DATABASE_FILE = 'database.sqlite';

    const dbConnection = new DataSource({
      type: 'sqlite',
      database: DATABASE_FILE,
      synchronize: false,
      migrations,
      migrationsRun: true,
      logging: ['error', 'info', 'warn'],
      entities: Entities,
    }).initialize();

    const agent = createAgent({
      plugins: [
        new KeyManager({
          store: new KeyStore(dbConnection),
          kms: {
            local: new KeyManagementSystem(
              new PrivateKeyStore(
                dbConnection,
                new SecretBox(process.env.KMS_SECRET_KEY),
              ),
            ),
          },
        }),
        new DIDManager({
          store: new DIDStore(dbConnection),
          defaultProvider: 'did:ethr:goerli',
          providers: {
            'did:ethr:goerli': new EthrDIDProvider({
              defaultKms: 'local',
              network: 'goerli',
              rpcUrl:
                'https://goerli.infura.io/v3/' + process.env.INFURA_PROJECT_ID,
            }),
            'did:web': new EthrDIDProvider({
              defaultKms: 'local',
            }),
          },
        }),
        new DIDResolverPlugin({
          resolver: new Resolver({
            ...ethrDidResolver({
              infuraProjectId: process.env.INFURA_PROJECT_ID,
            }),
            ...webDidResolver(),
          }),
        }),
        new CredentialPlugin(),
      ],
    });

    return agent;
  }

  async getID() {
    const agent = await this.getAgent();

    if (!(await agent.didManagerFind()).length) {
      await agent.didManagerCreate({ alias: 'default' });
    }

    const identifiers = await agent.didManagerFind();

    return identifiers[0];
  }
}
