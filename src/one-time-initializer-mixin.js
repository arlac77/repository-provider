const IS_INITIALIZED = Symbol('isInitialized');

export function OneTimeInititalizerMixin(base) {
  /**
   * enshures tha _initialize() will be called only once
   */
  return class OneTimeInititalizer extends base {
    /**
     * async initialization.
     * Will execute _intitialize() only once
     *
     * @return {Promise<undefined>}
     */
    async initialize(...args) {
      if (this[IS_INITIALIZED] === true) {
        return;
      }

      this[IS_INITIALIZED] = true;

      await this._initialize(...args);
    }

    /**
     * @return {boolean} true is initialize() has been done
     */
    get isInitialized() {
      return this[IS_INITIALIZED] ? true : false;
    }
  };
}
