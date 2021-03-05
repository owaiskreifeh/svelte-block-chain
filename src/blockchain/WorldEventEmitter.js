import { WorldEvent } from ".";

export class WorldEventEmitter {
    updateWorld (type, data) {
        World.instance.update(new WorldEvent(this, type, data))
    }
}