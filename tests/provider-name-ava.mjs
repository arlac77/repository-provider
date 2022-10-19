import test from "ava";
import {
  repositories,
  fragmentRepositories,
  providerParseNameTest
} from "repository-provider-test-support";

import { BaseProvider } from "repository-provider";

class MyProvider extends BaseProvider {
  get repositoryBases() {
    return super.repositoryBases.concat([
      "https://github.com/",
      "http://otherdomain.com/"
    ]);
  }
}

test("supports name", t => {
  const provider = new MyProvider();
  t.true(provider.supportsBase("https://github.com/"));
  t.true(provider.supportsBase(undefined));
});

test(providerParseNameTest, new BaseProvider(), repositories);
test(providerParseNameTest, new MyProvider(), repositories);

export async function providerNormalizesNamesTest(t, provider, fixtures) {
  for (const [name, repo] of Object.entries(fixtures)) {
    t.is(
      provider.normalizeRepositoryName(name),
      repo.repository,
      `normalizeRepositoryName ${name}`
    );

    /*
    if (repo.group !== undefined) {
      t.is(
        provider.normalizeGroupName(name),
        repo.group,
        `normalizeGroupName ${name}`
      );
    }*/
  }
}

providerNormalizesNamesTest.title = (
  providedTitle = "normaized names",
  provider
) => `${providedTitle} ${provider.name}`.trim();

test(providerNormalizesNamesTest, new MyProvider(), fragmentRepositories);
