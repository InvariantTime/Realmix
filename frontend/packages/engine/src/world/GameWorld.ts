import { GameEntity } from "./GameEntity";

export class GameWorld {
    private readonly entities = new Map<string, GameEntity>();

    public constructor() {

    }

    public addEntity(entity: GameEntity) {
        this.entities.set(entity.id, entity);
    }

    public removeEntity(id: string) {
        return this.entities.delete(id);
    }

    public hasEntity(id: string) {
        return this.entities.has(id);
    }

    public getEntities() : Iterable<GameEntity> {
        return this.entities.values();
    }
}