export const githubRepositories = {
  "https://github.com/arlac77/sync-test-repository.git#mybranch": {
    base: "https://github.com/",
    group: "arlac77",
    repository: "sync-test-repository",
    branch: "mybranch"
  },
  "https://user:password@github.com/arlac77/sync-test-repository.git#mybranch": {
    base: "https://github.com/",
    group: "arlac77",
    repository: "sync-test-repository",
    branch: "mybranch"
  },
  "https://user@github.com/arlac77/sync-test-repository.git#mybranch": {
    base: "https://github.com/",
    group: "arlac77",
    repository: "sync-test-repository",
    branch: "mybranch"
  }
};

export const bitbucketRepositories = {
  "git@bitbucket.org:arlac77/sync-test-repository.git#mybranch": {
    base: "git@bitbucket.org:",
    group: "arlac77",
    repository: "sync-test-repository",
    branch: "mybranch"
  },
  "git@bitbucket.org/arlac77/sync-test-repository.git": {
    base: "git@bitbucket.org/",
    group: "arlac77",
    repository: "sync-test-repository"
  },
  "https://arlac77@bitbucket.org/arlac77/sync-test-repository.git": {
    base: "https://bitbucket.org/",
    group: "arlac77",
    repository: "sync-test-repository"
  }
};

export const otherRepositories = {
  "http://otherdomain.com/arlac77/sync-test-repository.git#mybranch": {
    base: "http://otherdomain.com/",
    group: "arlac77",
    repository: "sync-test-repository",
    branch: "mybranch"
  },
  "git+http://otherdomain.com/arlac77/sync-test-repository.git#mybranch": {
    base: "http://otherdomain.com/",
    group: "arlac77",
    repository: "sync-test-repository",
    branch: "mybranch"
  },
  "git+http://arlac77@otherdomain.com/prefix/arlac77/sync-test-repository.git": {
    base: "http://otherdomain.com/",
    group: "arlac77",
    repository: "sync-test-repository"
  }
};

export const fragmentRepositories = {
  "": { repository: "" },
  "/": { base: "/", repository: "" },
  "/abc": { base: "/", repository: "abc" },

  "abc/def/g": { group: "abc", repository: "def" },
  "xxx/abc/def.git#mybranch": {
    group: "abc",
    repository: "def",
    branch: "mybranch"
  },
  abc: { repository: "abc" },
  " abc/def": { group: "abc", repository: "def" },
  "abc/def#mybranch ": {
    group: "abc",
    repository: "def",
    branch: "mybranch"
  },
  "abc/def.git": { group: "abc", repository: "def" },
  "abc/def.git#mybranch": {
    group: "abc",
    repository: "def",
    branch: "mybranch"
  }
};

export const repositories = {
  ...fragmentRepositories,
  ...githubRepositories,
  ...bitbucketRepositories,
  ...otherRepositories
};
