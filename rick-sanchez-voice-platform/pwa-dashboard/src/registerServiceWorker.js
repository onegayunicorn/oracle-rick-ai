import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() { console.log('PWA ready') },
    registered() {},
    cached() {},
    updatefound() {},
    updated() {},
    offline() {},
    error(error) { console.error('SW error:', error) }
  })
}
