import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server : {
//     port : 4445
//   }
// })

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5000,
//     host: '0.0.0.0',
//     allowedHosts: true
//   }
// })


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
  port: 5000,
  host: '0.0.0.0',
  allowedHosts: ['t-shirt-carol-runaround.ngrok-free.dev'],
  proxy: {
    '/backend': {
      target: 'http://75.119.146.115:5179',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/backend/, ''),
    },
  },
  }
})

