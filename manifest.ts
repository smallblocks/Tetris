import { setupManifest } from "@aspect-build/rules_startos/sdk";

export const { manifest, utils } = setupManifest({
  id: "tetris",
  title: "Tetris",
  version: "0.1.0:0",
  satisfies: [],
  releaseNotes: "Initial release - Classic Tetris for SATSCADE",
  license: "mit",
  wrapperRepo: "https://github.com/smallblocks/tetris",
  upstreamRepo: "https://github.com/smallblocks/tetris",
  supportSite: "https://github.com/smallblocks/tetris/issues",
  marketingSite: "https://github.com/smallblocks/tetris",
  donationUrl: null,
  description: {
    short: "Classic Tetris for SATSCADE",
    long: "The classic block-stacking puzzle game. Clear lines, score points, and compete for high scores on your sovereign arcade.",
  },
  assets: [],
  volumes: {
    main: "data",
  },
  images: {
    main: {
      source: {
        dockerBuild: {
          dockerFile: "Dockerfile",
          workdir: ".",
        },
      },
    },
  },
  hardwareRequirements: {
    device: {},
    arch: null,
    ram: null,
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    satscade: {
      description: "SATSCADE arcade launcher",
      optional: false,
    },
  },
  hasConfig: false,
  hasInstructions: true,
});

export const main = manifest.containers.main.setTemplate({
  image: manifest.images.main.ref,
  mounts: {
    "/data": manifest.volumes.main.ref,
  },
  env: {
    PORT: "80",
  },
  ready: {
    display: "Game Ready",
    kind: "running",
  },
  interfaces: {
    webui: {
      name: "Tetris",
      description: "Play Tetris",
      addressInfo: {
        username: null,
        hostId: "webui",
        internalPort: 80,
        scheme: "http",
        sslScheme: "https",
        suffix: "",
      },
      type: "ui",
    },
  },
});

export const instructions = manifest.instructions.setTemplate({
  version: "1",
  sections: [
    {
      heading: "How to Play",
      content: "Use arrow keys to move and rotate pieces. Clear lines to score points!",
    },
    {
      heading: "Controls",
      content: "← → Move | ↑ Rotate | ↓ Soft drop | SPACE Hard drop | P Pause",
    },
    {
      heading: "SATSCADE",
      content: "This game appears automatically in your SATSCADE arcade.",
    },
  ],
});
