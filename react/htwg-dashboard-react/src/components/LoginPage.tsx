import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/useAuth';

type AuthMode = 'login' | 'register';

export const LoginPage = () => {
    const [mode, setMode] = useState<AuthMode>('login');
    const [inputName, setInputName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { login, register, isAuthenticating } = useAuth();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError(null);

        try {
            if (mode === 'register') {
                await register(inputName, email, password);
            } else {
                await login(inputName, password);
            }
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : 'Authentifizierung ist fehlgeschlagen.',
            );
        }
    };

    const switchMode = () => {
        setMode((currentMode) => currentMode === 'login' ? 'register' : 'login');
        setError(null);
    };

    return (
        <div className="login-main">
            <header className="main-header">
                <div className="logo">
                    <div className="logo-link">
                        <img src="/assets/htwg-logo-no-bg.png" alt="HTWG Logo" className="logo-image" />
                        <span className="page-title">Dashboard</span>
                    </div>
                </div>
            </header>

            <main className="setup-main">
                <h1 className="auth-title">
                    {mode === 'login' ? 'Anmelden' : 'Registrieren'}
                </h1>

                <form onSubmit={handleSubmit} className="form-elem">
                    <div className="form-elem">
                        <label htmlFor="user-name">Username</label>
                        <input
                            type="text"
                            id="user-name"
                            placeholder="z.B. Max Mustermann"
                            minLength={3}
                            required
                            value={inputName}
                            onChange={(event) => setInputName(event.target.value)}
                        />
                    </div>

                    {mode === 'register' && (
                        <div className="form-elem">
                            <label htmlFor="user-email">E-Mail</label>
                            <input
                                type="email"
                                id="user-email"
                                placeholder="name@htwg-konstanz.de"
                                required
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>
                    )}

                    <div className="form-elem">
                        <label htmlFor="user-password">Passwort</label>
                        <input
                            type="password"
                            id="user-password"
                            placeholder="Mindestens 8 Zeichen"
                            minLength={8}
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>

                    {error && <p className="auth-error" role="alert">{error}</p>}

                    <button
                        type="submit"
                        className="button-confirm-index"
                        disabled={isAuthenticating}
                    >
                        {isAuthenticating
                            ? 'Bitte warten...'
                            : mode === 'login'
                                ? 'Anmelden'
                                : 'Account erstellen'}
                    </button>
                </form>

                <button type="button" className="auth-mode-button" onClick={switchMode}>
                    {mode === 'login'
                        ? 'Noch kein Account? Registrieren'
                        : 'Schon registriert? Anmelden'}
                </button>
            </main>
        </div>
    );
};
