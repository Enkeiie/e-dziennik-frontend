const { defineConfig } = require('@vue/cli-service')
module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: 'e_dziennik_backend:3000',
        ws: true,
        pathRewrite: { '^/api': "" },
        secure: false,
        changeOrigin: false
      },
    }
  },
  transpileDependencies: true,
}