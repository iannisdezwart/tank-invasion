enum TankOwner { PLAYER, ENEMY }
enum TankType { NORMAL }

const tankVel = (owner: TankOwner, type: TankType) =>
{
	const multiplier = owner == TankOwner.PLAYER ? 1 : 0.75

	switch (type)
	{
		case TankType.NORMAL:
			return 0.005 * multiplier
	}
}

const tankSize = (type: TankType) =>
{
	switch (type)
	{
		case TankType.NORMAL:
			return 0.08
	}
}

const tankTurretWidth = (type: TankType) =>
{
	switch (type)
	{
		case TankType.NORMAL:
			return 0.08
	}
}

const tankTurretHeight = (type: TankType) =>
{
	switch (type)
	{
		case TankType.NORMAL:
			return 0.05
	}
}

const tankColour = (owner: TankOwner) =>
{
	switch (owner)
	{
		case TankOwner.PLAYER:
			return '#33aaff'

		case TankOwner.ENEMY:
			return '#cc5533'
	}
}

const tankOutlineColour = (owner: TankOwner) =>
{
	switch (owner)
	{
		case TankOwner.PLAYER:
			return '#0077cc'

		case TankOwner.ENEMY:
			return '#aa1700'
	}
}

const tankHealth = (type: TankType) =>
{
	switch (type)
	{
		case TankType.NORMAL:
			return 100
	}
}

const tankShootDelay = (type: TankType) =>
{
	switch (type)
	{
		case TankType.NORMAL:
			return 500
	}
}

const HEALTH_BAR_WIDTH = 0.125
const HEALTH_BAR_HEIGHT = 0.025

class Tank
{
	x: number
	y: number
	xVel: number
	yVel: number
	maxVel: number
	angle: number
	size: number
	turretWidth: number
	turretHeight: number
	colour: string
	outlineColour: string
	health: number
	maxHealth: number
	shootDelay: number
	lastShot: number

	static tanks: Tank[] = []
	static ACCELERATION = 0.0002

	constructor(x: number, y: number, angle: number,
		owner: TankOwner, type: TankType)
	{
		this.x = x
		this.y = y
		this.xVel = 0
		this.yVel = 0
		this.maxVel = tankVel(owner, type)
		this.angle = angle
		this.size = tankSize(type)
		this.turretWidth = tankTurretWidth(type)
		this.turretHeight = tankTurretHeight(type)
		this.colour = tankColour(owner)
		this.outlineColour = tankOutlineColour(owner)
		this.health = tankHealth(type)
		this.maxHealth = this.health
		this.shootDelay = tankShootDelay(type)
		this.lastShot = 0

		Tank.tanks.push(this)
	}

	getXAcc()
	{
		const player = Player.instance
		let dx = player.x - this.x

		if (Math.abs(dx) > 1)
		{
			dx = 1
		}

		return Tank.ACCELERATION * (dx + Math.random() - 0.5)
	}

	getYAcc()
	{
		const player = Player.instance
		let dy = player.y - this.y

		if (Math.abs(dy) > 1)
		{
			dy = 1
		}

		return Tank.ACCELERATION * (dy + Math.random() - 0.5)
	}

	getAngle()
	{
		const player = Player.instance
		return Math.atan2(player.y - this.y, player.x - this.x)
	}

	/**
	 * Can be overriden to perform additional actions each time the tank is
	 * being rendered.
	 */
	eachTick()
	{
		const shoots = Math.random() < 0.01

		if (shoots && Date.now() - this.lastShot > this.shootDelay)
		{
			this.lastShot = Date.now()
			this.shoot()
		}
	}

	move()
	{
		const xAcc = this.getXAcc()
		const yAcc = this.getYAcc()

		this.xVel += xAcc
		this.yVel += yAcc

		const vel = Math.hypot(this.xVel, this.yVel)

		if (vel > this.maxVel)
		{
			this.xVel = this.xVel / vel * this.maxVel
			this.yVel = this.yVel / vel * this.maxVel
		}

		// Drag.

		this.xVel *= 0.97
		this.yVel *= 0.97

		this.x += this.xVel
		this.y += this.yVel

		// Position turret.

		this.angle = this.getAngle()
	}

	render()
	{
		this.move()
		this.eachTick()

		// The body is a light blue filled circle.

		GFX.fillCircle({
			x: this.x,
			y: this.y,
			radius: this.size,
			colour: this.colour
		})

		// Body outline.

		GFX.strokeCircle({
			x: this.x,
			y: this.y,
			radius: this.size,
			colour: this.outlineColour,
			lineWidth: 0.01
		})

		// The turret is a grey rotated rectangle.

		GFX.fillRect({
			x: this.x,
			y: this.y,
			width: this.turretWidth,
			height: this.turretHeight,
			colour: '#999',
			angle: this.angle,
			xBase: this.size,
			yBase: -this.turretHeight / 2
		})

		// Turret outline.

		GFX.strokeRect({
			x: this.x,
			y: this.y,
			width: this.turretWidth,
			height: this.turretHeight,
			colour: '#444',
			lineWidth: 0.01,
			angle: this.angle,
			xBase: this.size,
			yBase: -this.turretHeight / 2
		})

		// Health bar fill.

		let healthBarFillColour: string

		if (this.health > this.maxHealth * 0.67)
		{
			healthBarFillColour = '#2f0'
		}
		else if (this.health > this.maxHealth * 0.33)
		{
			healthBarFillColour = '#f70'
		}
		else
		{
			healthBarFillColour = '#f00'
		}

		GFX.fillRect({
			x: this.x - HEALTH_BAR_WIDTH / 2,
			y: this.y + this.size + HEALTH_BAR_HEIGHT * 2,
			width: HEALTH_BAR_WIDTH * this.health / this.maxHealth,
			height: HEALTH_BAR_HEIGHT,
			colour: healthBarFillColour
		})

		// Health bar outline.

		GFX.strokeRect({
			x: this.x - HEALTH_BAR_WIDTH / 2,
			y: this.y + this.size + HEALTH_BAR_HEIGHT * 2,
			width: HEALTH_BAR_WIDTH,
			height: HEALTH_BAR_HEIGHT,
			colour: '#333',
			lineWidth: 0.01
		})


	}

	static renderAll()
	{
		for (const tank of Tank.tanks)
		{
			tank.render()
		}
	}

	shoot()
	{
		const width = this.size + this.turretWidth
		const x = this.x + width * Math.cos(this.angle)
		const y = this.y + width * Math.sin(this.angle)
		const owner = this instanceof Player
			? BulletOwner.PLAYER : BulletOwner.ENEMY
		Bullet.spawn(x, y, this.angle, owner, BulletType.NORMAL)
	}

	touches(x: number, y: number)
	{
		if (Math.hypot(this.x - x, this.y - y) < this.size)
		{
			return true
		}
	}

	harm(amount: number)
	{
		this.health -= amount

		if (this.health <= 0)
		{
			this.kill()
		}
	}

	/**
	 * Can be overriden to perform additional actions when the tank is
	 * killed.
	 */
	handleDeath() {}

	kill()
	{
		// Remove the tank from the list of tanks.

		const i = Tank.tanks.indexOf(this)
		Tank.tanks[i] = Tank.tanks[Tank.tanks.length - 1]
		Tank.tanks.pop()

		this.handleDeath()
	}

	static spawnEnemy()
	{
		const x = Math.random() * MapBounds.width
		const y = Math.random() * MapBounds.height
		const angle = Math.random() * 2 * Math.PI
		const type = TankType.NORMAL
		const owner = TankOwner.ENEMY

		new Tank(x, y, angle, owner, type)
	}
}