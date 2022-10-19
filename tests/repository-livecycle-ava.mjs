import test from "ava";
import { SingleGroupProvider, MultiGroupProvider } from "repository-provider";

export async function repositoryCreateTest(
  t,
  provider,
  fullName,
  options,
  expectedFullName = fullName
) {
  const repository = await provider.createRepository(fullName, options);
  t.is(repository.fullName, expectedFullName, "fullName");

  const [groupName, repositoryName] = expectedFullName.split("/");
  if (repositoryName) {
    t.is(repository.name, repositoryName, "repository name");
    t.is(repository.owner.name, groupName, "group name");
  }
}

repositoryCreateTest.title = (
  providedTitle = "repository create",
  provider,
  fullName,
  options,
  expectedFullName = fullName
) => `${providedTitle} ${provider.name} ${fullName}`.trim();

test(repositoryCreateTest, new SingleGroupProvider(), "r1", {});
test(repositoryCreateTest, new SingleGroupProvider(), "r1#b1", {}, "r1");


function prepareMultiGroupProvider()
{
  const provider = new MultiGroupProvider();

  provider.addRepositoryGroup("g1");
  return provider;
}

test(repositoryCreateTest, prepareMultiGroupProvider(), "g1/r1", {});
