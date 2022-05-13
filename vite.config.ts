import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import {createHtmlPlugin} from 'vite-plugin-html'
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'
import WindiCSS from 'vite-plugin-windicss'
import { resolve } from 'path'

// https://vitejs.dev/config/
function pathResolve(dir: string): string {
  return resolve(__dirname, dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [NaiveUiResolver()]
    }),
    createSvgIconsPlugin({
      iconDirs: [pathResolve('src/icons')],
      symbolId: 'icon-[dir]-[name]'
    }),
    createHtmlPlugin({
      inject: {
        data: {
          //效果查看index.html中的<title>
          title: '黑白棋'
        }
      }
    }),
    WindiCSS()
  ],
  resolve: {
    // 设置别名
    alias: [
      { find: '@', replacement: pathResolve('src') },
      { find: 'store', replacement: pathResolve('src') }
    ]
  },
  server: {
    open: true
    //如果跨域，在此配置
    // proxy: {
    //   '/api': {
    //     target: 'https://your.url'
    //   }
    // }
  }
})
