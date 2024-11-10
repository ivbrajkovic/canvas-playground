import { Particle } from '@/app/(2D)/particles-rotating/particle';

export class ParticleManager {
  context: CanvasRenderingContext2D;

  sphereRadius = 280;
  radius_sp = 1.5;

  attack = 50;
  hold = 50;
  decay = 100;
  particleAlpha = 1;
  gravity = 0;
  numToAddEachFrame = 8;

  //random acceleration factors - causes some random motion
  randAccelX = 0.1;
  randAccelY = 0.1;
  randAccelZ = 0.1;
  particleRadius = 2.5;
  r = 70;
  g = 255;
  b = 140;

  private _turnSpeed = (2 * Math.PI) / 1200; //the sphere will rotate at this speed (one complete rotation every 1600 frames).
  get turnSpeed() {
    return (2 * Math.PI) / this._turnSpeed;
  }
  set turnSpeed(value: number) {
    this._turnSpeed = (2 * Math.PI) / value;
  }

  particleList: {
    first: Particle | null;
    next: Particle | null;
  };
  recycleBin: {
    first: Particle | null;
    next: Particle | null;
  };

  fLen: number;
  projCenterX: number;
  projCenterY: number;
  zMax: number;
  turnAngle: number;
  sphereCenterX: number;
  sphereCenterY: number;
  sphereCenterZ: number;
  zeroAlphaDepth: number;

  rgbString: string;

  particle: Particle | null = null;
  nextParticle: Particle | null = null;
  outsideTest = false;
  sinAngle = 1;
  cosAngle = 1;
  rotX = 0;
  rotZ = 0;
  depthAlphaFactor = 1;
  m = 1;
  theta = 1;
  phi = 1;
  x0 = 1;
  y0 = 1;
  z0 = 1;

  static of = (canvas: HTMLCanvasElement) => new ParticleManager(canvas);

  constructor(private canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Failed to get 2d context');

    this.context = context;
    this.rgbString = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',';

    this.projCenterX = this.canvas.width / 2;
    this.projCenterY = this.canvas.height / 2;

    this.particleList = {
      first: null,
      next: null,
    };

    this.recycleBin = {
      first: null,
      next: null,
    };

    this.fLen = 320; //represents the distance from the viewer to z=0 depth.
    this.zMax = this.fLen - 2; //we will not draw coordinates if they have too large of a z-coordinate (which means they are very close to the observer).

    this.sphereCenterX = 0;
    this.sphereCenterY = 0;
    this.sphereCenterZ = -3 - this.fLen;

    //alpha values will lessen as particles move further back, causing depth-based darkening:
    this.zeroAlphaDepth = -750;

    this.depthAlphaFactor = 1 / this.zeroAlphaDepth;
    this.turnAngle = 0; //initial angle
  }

  init = () => {
    this.projCenterX = this.canvas.width / 2;
    this.projCenterY = this.canvas.height / 2;
  };

  onTimer = () => {
    for (let i = 0; i < this.numToAddEachFrame; i++) {
      this.theta = Math.random() * 2 * Math.PI;
      this.phi = Math.acos(Math.random() * 2 - 1);
      this.x0 = this.sphereRadius * Math.sin(this.phi) * Math.cos(this.theta);
      this.y0 = this.sphereRadius * Math.sin(this.phi) * Math.sin(this.theta);
      this.z0 = this.sphereRadius * Math.cos(this.phi);

      //We use the addParticle function to add a new particle. The parameters set the position and velocity components.
      //Note that the velocity parameters will cause the particle to initially fly outwards away from the sphere center (after
      //it becomes unstuck).
      this.particle = this.addParticle(
        this.x0,
        this.sphereCenterY + this.y0,
        this.sphereCenterZ + this.z0,
        0.002 * this.x0,
        0.002 * this.y0,
        0.002 * this.z0,
      );

      //we set some "envelope" parameters which will control the evolving alpha of the particles.
      this.particle.attack = this.attack;
      this.particle.hold = this.hold;
      this.particle.decay = this.decay;
      this.particle.initValue = 0;
      this.particle.holdValue = this.particleAlpha;
      this.particle.lastValue = 0;

      //the particle will be stuck in one place until this time has elapsed:
      this.particle.stuckTime = 90 + Math.random() * 20;

      this.particle.accelX = 0;
      this.particle.accelY = this.gravity;
      this.particle.accelZ = 0;
    }

    //update viewing angle
    this.turnAngle = (this.turnAngle + this._turnSpeed) % (2 * Math.PI);
    this.sinAngle = Math.sin(this.turnAngle);
    this.cosAngle = Math.cos(this.turnAngle);

    //update and draw particles
    this.particle = this.particleList.first;
    while (this.particle != null) {
      //before list is altered record next particle
      this.nextParticle = this.particle.next;

      //update age
      this.particle.age++;

      //if the particle is past its "stuck" time, it will begin to move.
      if (this.particle.age > this.particle.stuckTime) {
        this.particle.velX +=
          this.particle.accelX + this.randAccelX * (Math.random() * 2 - 1);
        this.particle.velY +=
          this.particle.accelY + this.randAccelY * (Math.random() * 2 - 1);
        this.particle.velZ +=
          this.particle.accelZ + this.randAccelZ * (Math.random() * 2 - 1);

        this.particle.x += this.particle.velX;
        this.particle.y += this.particle.velY;
        this.particle.z += this.particle.velZ;
      }

      /*
			We are doing two things here to calculate display coordinates.
			The whole display is being rotated around a vertical axis, so we first calculate rotated coordinates for
			x and z (but the y coordinate will not change).
			Then, we take the new coordinates (rotX, y, rotZ), and project these onto the 2D view plane.
			*/
      this.rotX =
        this.cosAngle * this.particle.x +
        this.sinAngle * (this.particle.z - this.sphereCenterZ);
      this.rotZ =
        -this.sinAngle * this.particle.x +
        this.cosAngle * (this.particle.z - this.sphereCenterZ) +
        this.sphereCenterZ;
      this.m = (this.radius_sp * this.fLen) / (this.fLen - this.rotZ);
      this.particle.projX = this.rotX * this.m + this.projCenterX;
      this.particle.projY = this.particle.y * this.m + this.projCenterY;

      //update alpha according to envelope parameters.
      if (
        this.particle.age <
        this.particle.attack + this.particle.hold + this.particle.decay
      ) {
        if (this.particle.age < this.particle.attack) {
          this.particle.alpha =
            ((this.particle.holdValue - this.particle.initValue) /
              this.particle.attack) *
              this.particle.age +
            this.particle.initValue;
        } else if (this.particle.age < this.particle.attack + this.particle.hold) {
          this.particle.alpha = this.particle.holdValue;
        } else if (
          this.particle.age <
          this.particle.attack + this.particle.hold + this.particle.decay
        ) {
          this.particle.alpha =
            ((this.particle.lastValue - this.particle.holdValue) /
              this.particle.decay) *
              (this.particle.age - this.particle.attack - this.particle.hold) +
            this.particle.holdValue;
        }
      } else {
        this.particle.dead = true;
      }

      //see if the particle is still within the viewable range.
      if (
        this.particle.projX > this.canvas.width ||
        this.particle.projX < 0 ||
        this.particle.projY < 0 ||
        this.particle.projY > this.canvas.height ||
        this.rotZ > this.zMax
      ) {
        this.outsideTest = true;
      } else {
        this.outsideTest = false;
      }

      if (this.outsideTest || this.particle.dead) {
        this.recycle(this.particle);
      } else {
        //depth-dependent darkening
        this.depthAlphaFactor = 1 - this.rotZ / this.zeroAlphaDepth;
        this.depthAlphaFactor =
          this.depthAlphaFactor > 1
            ? 1
            : this.depthAlphaFactor < 0
            ? 0
            : this.depthAlphaFactor;

        //draw
        this.particle.draw(
          this.context,
          this.rgbString,
          this.depthAlphaFactor,
          this.particleRadius,
          this.m,
        );
      }

      this.particle = this.nextParticle;
    }
  };

  addParticle = (
    x0: number,
    y0: number,
    z0: number,
    vx0: number,
    vy0: number,
    vz0: number,
  ) => {
    let newParticle: Particle;

    //check recycle bin for available drop:
    if (this.recycleBin.first !== null) {
      newParticle = this.recycleBin.first;
      //remove from bin
      if (newParticle.next !== null) {
        this.recycleBin.first = newParticle.next;
        newParticle.next.prev = null;
      } else {
        this.recycleBin.first = null;
      }
    }
    //if the recycle bin is empty, create a new particle
    else {
      newParticle = new Particle();
    }

    //add to beginning of particle list
    if (this.particleList.first == null) {
      this.particleList.first = newParticle;
      newParticle.prev = null;
      newParticle.next = null;
    } else {
      newParticle.next = this.particleList.first;
      this.particleList.first.prev = newParticle;
      this.particleList.first = newParticle;
      newParticle.prev = null;
    }

    //initialize
    newParticle.x = x0;
    newParticle.y = y0;
    newParticle.z = z0;
    newParticle.velX = vx0;
    newParticle.velY = vy0;
    newParticle.velZ = vz0;
    newParticle.age = 0;
    newParticle.dead = false;
    if (Math.random() < 0.5) {
      newParticle.right = true;
    } else {
      newParticle.right = false;
    }
    return newParticle;
  };

  recycle = (p: Particle) => {
    //remove from particleList
    if (this.particleList.first === p) {
      if (p.next !== null) {
        p.next.prev = null;
        this.particleList.first = p.next;
      } else {
        this.particleList.first = null;
      }
    } else {
      if (p.next === null) {
        if (p.prev !== null) {
          p.prev.next = null;
        }
      } else {
        if (p.prev !== null) {
          p.prev.next = p.next;
        }
        p.next.prev = p.prev;
      }
    }
    //add to recycle bin
    if (this.recycleBin.first === null) {
      this.recycleBin.first = p;
      p.prev = null;
      p.next = null;
    } else {
      p.next = this.recycleBin.first;
      this.recycleBin.first.prev = p;
      this.recycleBin.first = p;
      p.prev = null;
    }
  };
}
