import { getProfile, getAddresses } from '@/actions/profile'
import { getPrescriptions } from '@/actions/prescriptions'
import { ProfileForm } from './profile-form'
import { Profile } from '@/types/index'
import { AddressManager } from './address-manager'
import { PrescriptionManager } from './prescription-manager'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Ensure profile exists (lazy creation check logic or just fetch)
    // Since we added a trigger, profile should exist. 
    // If not (old users), we might need to handle null profile gracefully or create it on fly.
    // The action `getProfile` returns null if not found.
    let profile = await getProfile()
    const [addresses, prescriptions] = await Promise.all([
        getAddresses(),
        getPrescriptions()
    ])

    if (!profile) {
        // Fallback for users created before trigger
        profile = {
            id: user.id,
            email: user.email,
            full_name: '',
            phone: '',
            tax_id: '',
            tax_condition: 'consumidor_final'
        } as Profile
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold text-accent tracking-[0.3em] uppercase">Panel de Usuario</span>
                    <div className="h-px w-12 bg-accent/30" />
                </div>
                <h1 className="text-4xl font-black text-primary tracking-tighter uppercase mb-2">Mi Perfil</h1>
                <p className="text-gray-500 font-medium tracking-tight">Gestiona tu información personal y direcciones de envío.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Information Card */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="premium-card bg-white p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-accent font-black text-xl">
                                {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-sm font-black text-primary uppercase tracking-widest">Datos Personales</h2>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight leading-none mt-1">{user.email}</p>
                            </div>
                        </div>
                        <ProfileForm profile={profile!} />
                    </div>

                    <div className="pt-8">
                        <PrescriptionManager prescriptions={prescriptions} />
                    </div>
                </div>

                {/* Addresses Card */}
                <div className="lg:col-span-5">
                    <div className="premium-card bg-gray-50 p-8 border-dashed">
                        <h2 className="text-sm font-black text-primary uppercase tracking-widest mb-8 flex items-center gap-2">
                            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Mis Domicilios
                        </h2>
                        <AddressManager addresses={addresses} />
                    </div>

                    <div className="mt-8 p-6 bg-accent/5 rounded-2xl border border-accent/10">
                        <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-2">Ayuda & Soporte</p>
                        <p className="text-xs text-primary font-medium leading-relaxed">¿Necesitas asistencia con tu cuenta o un pedido especial? Nuestro equipo concierge está disponible para ayudarte.</p>
                        <button className="mt-4 text-[10px] font-black text-primary uppercase tracking-widest hover:text-accent transition-colors">Contactar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
