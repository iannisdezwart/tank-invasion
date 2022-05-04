class Player extends Tank
{
	goesLeft: number
	goesRight: number
	goesUp: number
	goesDown: number
	isShooting: boolean
	score: number

	static instance: Player

	constructor()
	{
		super(MapBounds.width / 2, MapBounds.height / 2, 0,
			TankOwner.PLAYER, TankType.NORMAL)

		this.goesLeft = 0
		this.goesRight = 0
		this.goesUp = 0
		this.goesDown = 0
		this.isShooting = false
		this.score = 0
		this.maxVel = 0.005

		addEventListener('keydown', this.handleKeyDown.bind(this))
		addEventListener('keyup', this.handleKeyUp.bind(this))
		addEventListener('mousemove', this.handleMouseMove.bind(this))

		Player.instance = this
	}

	handleKeyDown(e: KeyboardEvent)
	{
		switch (e.code)
		{
		case 'KeyA':
			this.goesLeft = 1
			break

		case 'KeyD':
			this.goesRight = 1
			break

		case 'KeyW':
			this.goesUp = 1
			break

		case 'KeyS':
			this.goesDown = 1
			break

		case 'Space':
			this.isShooting = true
			break
		}
	}

	handleKeyUp(e: KeyboardEvent)
	{
		switch (e.code)
		{
		case 'KeyA':
			this.goesLeft = 0
			break

		case 'KeyD':
			this.goesRight = 0
			break

		case 'KeyW':
			this.goesUp = 0
			break

		case 'KeyS':
			this.goesDown = 0
			break

		case 'Space':
			this.isShooting = false
			break
		}
	}

	handleMouseMove(e: MouseEvent)
	{
		this.angle = Math.atan2(e.clientY - 0.5 * innerHeight,
			e.clientX - 0.5 * innerWidth)
	}

	getXAcc()
	{
		return Tank.ACCELERATION * (this.goesRight - this.goesLeft)
	}

	getYAcc()
	{
		return Tank.ACCELERATION * (this.goesDown - this.goesUp)
	}

	getAngle()
	{
		return this.angle
	}

	eachTick()
	{
		document.querySelector('#score-value').innerHTML
			= 'Score: ' + this.score.toString()

		if (this.isShooting
			&& Date.now() - this.lastShot > this.shootDelay)
		{
			this.lastShot = Date.now()
			this.shoot()
		}

		if (this.x < 0)
		{
			this.x = 0
		}
		else if (this.x > MapBounds.width)
		{
			this.x = MapBounds.width
		}

		if (this.y < 0)
		{
			this.y = 0
		}
		else if (this.y > MapBounds.height)
		{
			this.y = MapBounds.height
		}
	}

	handleDeath()
	{
		setTimeout(() => {
			new Player()
		}, 3000)
	}
}