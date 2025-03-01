export default Object.freeze({
  STORAGE_KEY: {
    AGREEMENT: `${__PROJECT_NAME__}:Agreement`,
    BASE_CONFIG: `${__PROJECT_NAME__}:BaseConfig`,
    PLUGIN_CONFIG: (id) => `${__PROJECT_NAME__}:PluginConfig:${id}`,
  },
});
