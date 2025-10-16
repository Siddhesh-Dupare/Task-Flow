
interface AuthLayoutProps {
    children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div>
            <main className="min-h-screen flex justify-center items-center">
                <div className="mx-auto max-w-screen-2xl p-4">
                    <div className="p-4">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AuthLayout;