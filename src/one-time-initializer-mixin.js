const IS_INITIALIZED = Symbol('isInitialized');

export function OneTimeInititalizerMixin(base) {
  return class _OneTimeInititalizer extends base {
    /**
     * async initialization will execute _intitialize() only once
     *
     * @return {Promise<undefined>}
     */
    async initialize(...args) {
      if (this[IS_INITIALIZED] === true) {
        return;
      }

      await this._initialize(...args);

      this[IS_INITIALIZED] = true;
    }
  };
}
