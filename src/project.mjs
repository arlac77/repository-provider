import { NamedObject } from "./named-object.mjs";

/**
 * 
 */
export class Project extends NamedObject {
  constructor(owner, name, options) {
    super(name, options, {
      owner: { value: owner }
    });

    owner._addProject(this);
  }}
