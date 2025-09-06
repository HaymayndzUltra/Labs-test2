export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie('auth-token')

  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    onRequest({ request, options }) {
      // Add auth header if token exists
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`,
        }
      }
    },
    onResponseError({ response }) {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        // Clear auth and redirect to login
        const { logout } = useAuth()
        logout()
      }
    },
  })

  return api
}