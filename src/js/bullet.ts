interface BulletMultipliers
{
	damage: number
	penetration: number
	speed: number
}

enum BulletType { NORMAL }

const bulletVel = (type: BulletType) =>
{
	switch (type)
	{
	case BulletType.NORMAL:
		return 0.0075
	}
}

const bulletColour = (owner: Tank) =>
{
	if (owner instanceof Player)
	{
		return '#33aaff'
	}

	return '#ff5533'
}

const bulletOutlineColour = (owner: Tank) =>
{
	if (owner instanceof Player)
	{
		return '#0077cc'
	}

	return '#cc1700'
}

const bulletSize = (type: BulletType) =>
{
	switch (type)
	{
	case BulletType.NORMAL:
		return 0.025
	}
}

const bulletDamage = (type: BulletType) =>
{
	switch (type)
	{
	case BulletType.NORMAL:
		return 5
	}
}

const bulletPenetration = (type: BulletType) =>
{
	switch (type)
	{
	case BulletType.NORMAL:
		return 3
	}
}

class Bullet
{
	owner: Tank
	x: number
	y: number
	vel: number
	angle: number
	colour: string
	outlineColour: string
	size: number
	damage: number
	penetration: number
	hitObjects: Set<Object>

	static bullets: Bullet[] = []

	constructor(x: number, y: number, angle: number,
		owner: Tank, type: BulletType, multipliers: BulletMultipliers)
	{
		this.owner = owner
		this.x = x
		this.y = y
		this.vel = bulletVel(type) * multipliers.speed
		this.angle = angle
		this.colour = bulletColour(owner)
		this.outlineColour = bulletOutlineColour(owner)
		this.size = bulletSize(type)
		this.damage = bulletDamage(type) * multipliers.damage
		this.penetration = bulletPenetration(type) * multipliers.penetration
		this.hitObjects = new Set()
	}

	collision()
	{
		// Go through each tank and check for collision.

		for (const tank of Tank.tanks)
		{
			if (tank.touches(this.x, this.y)
				&& !this.hitObjects.has(tank))
			{
				this.hitObjects.add(tank)
				tank.hit(this)
			}
		}

		// Go through each score block and check for collision.

		for (const scoreBlock of ScoreBlock.scoreBlocks)
		{
			if (scoreBlock.touches(this.x, this.y)
				&& !this.hitObjects.has(scoreBlock))
			{
				this.hitObjects.add(scoreBlock)
				scoreBlock.hit(this)
			}
		}
	}

	despawn()
	{
		// Remove this bullet from the list of bullets.

		const i = Bullet.bullets.indexOf(this)
		Bullet.bullets[i] = Bullet.bullets[Bullet.bullets.length - 1]
		Bullet.bullets.pop()
	}

	move()
	{
		this.x += this.vel * Math.cos(this.angle)
		this.y += this.vel * Math.sin(this.angle)

		this.collision()
	}

	static renderAll()
	{
		for (let i = 0; i < this.bullets.length; i++)
		{
			// Move the bullet.

			const bullet = this.bullets[i]
			bullet.move()

			// Remove the bullet if it's off the map.

			if (!MapBounds.isInBigBounds(bullet.x, bullet.y))
			{
				this.bullets[i] = this.bullets[this.bullets.length - 1]
				this.bullets.pop()
			}

			// Draw the inner circle.

			GFX.fillCircle({
				x: bullet.x,
				y: bullet.y,
				radius: bullet.size,
				colour: bullet.colour
			})

			// Draw the outline.

			GFX.strokeCircle({
				x: bullet.x,
				y: bullet.y,
				radius: bullet.size,
				colour: bullet.outlineColour,
				lineWidth: 0.01
			})
		}
	}

	static spawn(x: number, y: number, angle: number,
		owner: Tank, type: BulletType, multipliers: BulletMultipliers)
	{
		const bullet = new Bullet(x, y, angle, owner, type, multipliers)
		Bullet.bullets.push(bullet)
	}
}