class Product
{
	basePrice: number
	level: number

	constructor(basePrice: number)
	{
		this.basePrice = basePrice
		this.level = 1
	}

	price()
	{
		return Math.floor(this.basePrice * Math.pow(1.5, this.level))
	}
}

class Store {
	static maxHealth = new Product(10)
	static bulletDamage = new Product(10)
	static bulletPenetration = new Product(10)
	static bulletSpeed = new Product(10)

	static update()
	{
		// Update money.

		document.querySelector('#money-value').innerHTML
			= '$' + Player.instance.score.toString()

		// Update prices and levels.

		const maxHealth = document.querySelector('#max-health')
		const maxHealthPrice = document.querySelector('#max-health .price')
		const maxHealthLevel = document.querySelector('#max-health .level')
		maxHealthPrice.innerHTML = `$${ Store.maxHealth.price() }`
		maxHealthLevel.innerHTML = `Lvl ${ Store.maxHealth.level }`
		maxHealth.classList.toggle('greyed-out',
		Player.instance.score < Store.maxHealth.price())

		const bulletDamage = document.querySelector('#bullet-damage')
		const bulletDamagePrice = document.querySelector('#bullet-damage .price')
		const bulletDamageLevel = document.querySelector('#bullet-damage .level')
		bulletDamagePrice.innerHTML = `$${ Store.bulletDamage.price() }`
		bulletDamageLevel.innerHTML = `Lvl ${ Store.bulletDamage.level }`
		bulletDamage.classList.toggle('greyed-out',
		Player.instance.score < Store.bulletDamage.price())

		const bulletPenetration = document.querySelector('#bullet-penetration')
		const bulletPenetrationPrice = document.querySelector('#bullet-penetration .price')
		const bulletPenetrationLevel = document.querySelector('#bullet-penetration .level')
		bulletPenetrationPrice.innerHTML = `$${ Store.bulletPenetration.price() }`
		bulletPenetrationLevel.innerHTML = `Lvl ${ Store.bulletPenetration.level }`
		bulletPenetration.classList.toggle('greyed-out',
		Player.instance.score < Store.bulletPenetration.price())

		const bulletSpeed = document.querySelector('#bullet-speed')
		const bulletSpeedPrice = document.querySelector('#bullet-speed .price')
		const bulletSpeedLevel = document.querySelector('#bullet-speed .level')
		bulletSpeedPrice.innerHTML = `$${ Store.bulletSpeed.price() }`
		bulletSpeedLevel.innerHTML = `Lvl ${ Store.bulletSpeed.level }`
		bulletSpeed.classList.toggle('greyed-out',
		Player.instance.score < Store.bulletSpeed.price())
	}

	static buyMaxHealth()
	{
		if (Player.instance.score < Store.maxHealth.price())
		{
			return
		}

		Player.instance.score -= Store.maxHealth.price()
		Store.maxHealth.level++
		Player.instance.maxHealth *= 1.25
	}

	static buyBulletDamage()
	{
		if (Player.instance.score < Store.bulletDamage.price())
		{
			return
		}

		Player.instance.score -= Store.bulletDamage.price()
		Store.bulletDamage.level++
		Player.instance.bulletDamageLevel *= 1.25
	}

	static buyBulletPenetration()
	{
		if (Player.instance.score < Store.bulletPenetration.price())
		{
			return
		}

		Player.instance.score -= Store.bulletPenetration.price()
		Store.bulletPenetration.level++
		Player.instance.bulletPenetrationLevel *= 1.25
	}

	static buyBulletSpeed()
	{
		if (Player.instance.score < Store.bulletSpeed.price())
		{
			return
		}

		Player.instance.score -= Store.bulletSpeed.price()
		Store.bulletSpeed.level++
		Player.instance.bulletSpeedLevel *= 1.25
	}
}

addEventListener('keypress', e =>
{
	if (e.code == 'Digit1')
	{
		Store.buyMaxHealth()
	}

	if (e.code == 'Digit2')
	{
		Store.buyBulletDamage()
	}

	if (e.code == 'Digit3')
	{
		Store.buyBulletPenetration()
	}

	if (e.code == 'Digit4')
	{
		Store.buyBulletSpeed()
	}
})