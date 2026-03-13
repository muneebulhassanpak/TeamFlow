import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

type ProfileRow = {
  id: string
  onboarding_completed: boolean
  default_org_slug: string | null
}

async function getProfile(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string,
): Promise<ProfileRow | null> {
  const { data } = await supabase
    .from('profiles')
    .select('id, onboarding_completed, default_org_slug')
    .eq('id', userId)
    .single()
  return data as ProfileRow | null
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Refresh session — do not remove
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Public routes — always accessible
  const isPublicRoute =
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname.startsWith('/auth/')

  if (!user && !isPublicRoute) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  if (user) {
    // Redirect logged-in users away from auth pages
    if (pathname === '/login' || pathname === '/signup') {
      const profile = await getProfile(supabase, user.id)

      if (!profile?.onboarding_completed) {
        const onboardUrl = request.nextUrl.clone()
        onboardUrl.pathname = '/onboarding'
        return NextResponse.redirect(onboardUrl)
      }

      const slug = profile.default_org_slug ?? ''
      const dashUrl = request.nextUrl.clone()
      dashUrl.pathname = `/${slug}/dashboard`
      return NextResponse.redirect(dashUrl)
    }

    // Onboarding gate — all app routes require completed onboarding
    if (pathname !== '/onboarding' && !isPublicRoute) {
      const profile = await getProfile(supabase, user.id)

      if (!profile?.onboarding_completed) {
        const onboardUrl = request.nextUrl.clone()
        onboardUrl.pathname = '/onboarding'
        return NextResponse.redirect(onboardUrl)
      }
    }
  }

  return supabaseResponse
}
