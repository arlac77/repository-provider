const IS_INITIALIZED = Symbol("isInitialized");
const DURING_INITIALIZATION = Symbol("duringInitialization");

export function OneTimeInititalizerMixin(base) {
  /**
   * enshures that _initialize() will be called only once
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

      if (this[DURING_INITIALIZATION]) {
        return this[DURING_INITIALIZATION];
      }

      this[DURING_INITIALIZATION] = this._initialize(...args);

      await this[DURING_INITIALIZATION];

      this[DURING_INITIALIZATION] = undefined;
      this[IS_INITIALIZED] = true;
    }

    /**
     * @return {boolean} true is initialize() has been done
     */
    get isInitialized() {
      return this[IS_INITIALIZED] ? true : false;
    }
  };
}
