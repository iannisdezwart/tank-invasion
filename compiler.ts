import { compilePages, inlineJS, inlineSASS, PageShell } from 'page-compiler'

const main = async () =>
{
	const pageShell = new PageShell({
		head: /* html */ `
		${ await inlineSASS('src/sass/index.sass') }
		`
	})

	compilePages([
		{
			html: pageShell.render('TankInvasion', /* html */ `
			<canvas></canvas>
			<div id="bottom-hud">
				<div id="money">
					<span id="money-value">$0</span>
				</div>
				<div id="shop">
					<div class="item greyed-out" id="max-health">
						<div class="first-row">
							<div class="key">1</div>
							<div class="label">Max Health</div>
						</div>
						<div class="second-row">
							<div class="price"></div>
							<div class="level"></div>
						</div>
					</div>
					<div class="item greyed-out" id="bullet-damage">
						<div class="first-row">
							<div class="key">2</div>
							<div class="label">Bullet Damage</div>
						</div>
						<div class="second-row">
							<div class="price"></div>
							<div class="level"></div>
						</div>
					</div>
					<div class="item greyed-out" id="bullet-penetration">
						<div class="first-row">
							<div class="key">3</div>
							<div class="label">Bullet Penetration</div>
						</div>
						<div class="second-row">
							<div class="price"></div>
							<div class="level"></div>
						</div>
					</div>
					<div class="item greyed-out" id="bullet-speed">
						<div class="first-row">
							<div class="key">4</div>
							<div class="label">Bullet Speed</div>
						</div>
						<div class="second-row">
							<div class="price"></div>
							<div class="level"></div>
						</div>

					</div>
				</div>
			</div>
			${ await inlineJS('src/js/gfx.js') }
			${ await inlineJS('src/js/map-bounds.js') }
			${ await inlineJS('src/js/bullet.js') }
			${ await inlineJS('src/js/tank.js') }
			${ await inlineJS('src/js/score-block.js') }
			${ await inlineJS('src/js/store.js') }
			${ await inlineJS('src/js/player.js') }
			${ await inlineJS('src/js/index.js') }
			`, {
				author: 'Iannis de Zwart',
				description: 'Tank Invasion',
				keywords: [ 'tank', 'invasion', 'game' ]
			}),
			path: '/index.html'
		}
	])
}

main()