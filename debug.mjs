import { MultiGroupProvider } from "repository-provider";

const provider = new MultiGroupProvider();

async function x()
{
  const g1 = await provider.addRepositoryGroup("g1");
  await g1.addRepository("r1");
  await g1.addRepository("r2");
  const g2 = await provider.addRepositoryGroup("g2");
  await g2.addRepository("r1");
  const g3 = await provider.addRepositoryGroup("g3");


  console.log("A",provider.repositoryGroups);

  for await (const r of provider.repositories()) {
      console.log(r.fullName);
  }

}


x();

