module.exports = {
	plugins: [
		require('autoprefixer')
		/*
			这种写法配置browsers官方不推荐,
			推荐的是使用.browserslistrc或者Browserslist
			require('autoprefixer')({
				'browsers': [
					'defaults',
	        'not ie < 11',
	        'last 2 versions',
	        '> 1%',
	        'iOS 7',
	        'last 3 iOS versions'
				]
			})
		*/
	]
}