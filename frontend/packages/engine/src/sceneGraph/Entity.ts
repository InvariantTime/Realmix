import { EntityComponent } from "./EntityComponent";
import { EntityComponentBase } from "./EntityComponentBase";
import { EntityTransform } from "./EntityTransform";

export class Entity {
    private _components: EntityComponentBase[] = [];
    private _transform?: EntityTransform;

    public readonly id: string;

    public get transform(): EntityTransform {
        return this._transform ??= this.getComponent(EntityTransform)!;
    }

    public constructor(id: string) {
        this.id = id;
        this.addComponent(new EntityTransform());
    }

    public addComponent(component: EntityComponentBase) {
        this._components = [...this._components, component];
    }

    public removeComponent(component: EntityComponentBase) {
        this._components = this._components.filter(x => x !== component);
    }

    public getAllComponents(predicate?: (c: EntityComponentBase) => boolean) : Iterable<EntityComponentBase> {

        if (predicate === undefined)
            return this._components;

        return this._components.filter(predicate);
    }

    public getComponent<T extends EntityComponentBase>(componentClass: new (...args: any[]) => T): T | undefined {
    const found = this._components.find(c => c instanceof componentClass);
    return (found as T) || undefined;
  }
}