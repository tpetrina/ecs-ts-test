type Component = {
  type: string;
};

type Entity = {
  id: number;
  components: Component[];
};

let nextId = 1;
function createEntity(...components: Component[]) {
  return {
    id: nextId++,
    components,
  };
}

// something we need to supply every frame
// can be current time, current frame number, both or more
type TickInfo = number;

type System = {
  update: (tickInfo: TickInfo, entities: Entity[]) => void;
};

class PositionComponent implements Component {
  type = "position";
  constructor(public x: number, public y: number) {}
}

function getComponent<T extends Component>(e: Entity, type: string) {
  return e.components.find((c) => c.type === type) as T;
}

function createRenderSystem(): System {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  return {
    update: (time: number, entities: Entity[]) => {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();

      entities.forEach((e) => {
        const p = getComponent<PositionComponent>(e, "position");
        ctx.fillRect(p.x, p.y, 10, 10);
      });
    },
  };
}

export function ecsdemo1() {
  const systems: System[] = [createRenderSystem()];
  const entities: Entity[] = [createEntity(new PositionComponent(10, 10))];

  function render() {
    const now = new Date().getTime();

    systems.forEach((system) => system.update(now, entities));

    requestAnimationFrame(render);
  }

  render();
}
