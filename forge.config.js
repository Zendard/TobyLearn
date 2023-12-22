module.exports = {
	packagerConfig: {
		icon: "./iconTL",
		asar: true,
	},
	rebuildConfig: {},
	makers: [
		{
			name: "@electron-forge/maker-squirrel",
			config: {
				setupIcon: "./iconTL.ico",
			},
		},
		{
			name: "@electron-forge/maker-zip",
			platforms: ["darwin"],
		},
		{
			name: "@electron-forge/maker-deb",
			config: {
				options: {
					icon: "./iconTL.png",
				},
			},
		},
		{
			name: "@electron-forge/maker-rpm",
			config: {},
		},
	],
	plugins: [
		{
			name: "@electron-forge/plugin-auto-unpack-natives",
			config: {},
		},
	],
};
