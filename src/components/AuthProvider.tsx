"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";
import AuthModal from "@/components/AuthModal";

interface Subscription {
    id: string;
    plan_name: string;
    status: string;
    credits_per_period: number;
    price_cents: number;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
}

interface AuthContextValue {
    user: User | null;
    credits: number;
    subscription: Subscription | null;
    loading: boolean;
    refreshCredits: () => Promise<void>;
    refreshSubscription: () => Promise<void>;
    signOut: () => Promise<void>;
    openAuthModal: () => void;
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    credits: 0,
    subscription: null,
    loading: true,
    refreshCredits: async () => { },
    refreshSubscription: async () => { },
    signOut: async () => { },
    openAuthModal: () => { },
});

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [credits, setCredits] = useState(0);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [authModalOpen, setAuthModalOpen] = useState(false);

    // Memoize supabase client to prevent unnecessary re-creations
    const [supabase] = useState(() => createClient());

    const openAuthModal = useCallback(() => setAuthModalOpen(true), []);

    const refreshCredits = useCallback(async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from("user_credits")
            .select("credits")
            .eq("id", user.id)
            .maybeSingle(); // maybeSingle() handles 0 rows gracefully

        if (error) {
            console.error("Error fetching credits:", error);
            return;
        }

        if (data) setCredits(data.credits);
    }, [user, supabase]);

    const refreshSubscription = useCallback(async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .in("status", ["active", "past_due", "cancelled"])
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle(); // maybeSingle() handles 0 rows gracefully

        if (error) {
            console.error("Error fetching subscription:", error);
            return;
        }

        setSubscription(data || null);
    }, [user, supabase]);

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user: authUser },
            } = await supabase.auth.getUser();
            setUser(authUser);
            setLoading(false);
        };

        getUser();

        const {
            data: { subscription: authSubscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => authSubscription.unsubscribe();
    }, [supabase]);

    // Fetch credits and subscription when user changes
    useEffect(() => {
        if (user) {
            refreshCredits();
            refreshSubscription();
        } else {
            setCredits(0);
            setSubscription(null);
        }
    }, [user, refreshCredits, refreshSubscription]);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setCredits(0);
        setSubscription(null);
        window.location.href = "/";
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                credits,
                subscription,
                loading,
                refreshCredits,
                refreshSubscription,
                signOut,
                openAuthModal,
            }}
        >
            {children}
            <AuthModal
                open={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
            />
        </AuthContext.Provider>
    );
}
