export function IssueMixin(parent) {
  return class Issue extends parent {
    async *labels() {}
    async *assignees() {}
    async assignee() {}
    async milestone() {}
  };
}
