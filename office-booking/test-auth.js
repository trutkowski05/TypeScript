const testAuth = async () => {
    try {
        console.log("1. TEST REJESTRACJI...");
        const registerRes = await fetch('http://localhost:3000/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: "dyrektor@biuro.pl",
                password: "superTrudneHaslo123",
                role: "ADMIN"
            })
        });
        const registerData = await registerRes.json();
        console.log("Odpowiedź rejestracji:", registerData);

        console.log("\n2. TEST LOGOWANIA...");
        const loginRes = await fetch('http://localhost:3000/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: "dyrektor@biuro.pl",
                password: "superTrudneHaslo123"
            })
        });
        const loginData = await loginRes.json();
        console.log("Odpowiedź logowania (Zwróć uwagę na token!):", loginData);

    } catch (err) {
        console.error("Błąd podczas testu:", err);
    }
};

testAuth();
