import { useState } from 'react';

interface LoginPageProps {
    onLoginSuccess: (username: string) => void;
}

export const LoginPage = ({ onLoginSuccess }: LoginPageProps) => {
    const [inputName, setInputName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (inputName.trim() !== '') {
            onLoginSuccess(inputName);
        }
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
                <form onSubmit={handleSubmit} className="form-elem">
                    <div className="form-elem">
                        <label htmlFor="user-name">Username</label>
                        <input 
                            type="text" 
                            id="user-name" 
                            placeholder="z.B Max Mustermann" 
                            required 
                            value={inputName}
                            onChange={(e) => setInputName(e.target.value)}
                        />
                    </div>

                    <div className="form-elem">
                        <label htmlFor="user-password">Passwort</label>
                        <input 
                            type="password" 
                            id="user-password" 
                            placeholder="z.B 123" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <button type="submit" className="button-confirm-index">Bestätigen</button>
                </form>
                
                <footer>
                    <button type="button" className="button-register-index">register</button>
                    <button type="button" className="button-pasforgot-index">passwort vergessen</button>
                </footer>
            </main>
        </div>
    );
};