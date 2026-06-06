import { GameEntity } from "./GameEntity";

export class GameWorld {
    private readonly entities = new Map<String, GameEntity>();

    public constructor() {

    }

    public addEntity(entity: GameEntity) {
        this.entities.set(entity.id, entity);
    }

    public removeEntity(id: String) {
        return this.entities.delete(id);
    }

    public hasEntity(id: String) {
        return this.entities.has(id);
    }

    public getEntities() : Iterable<GameEntity> {
        return this.entities.values();
    }
}