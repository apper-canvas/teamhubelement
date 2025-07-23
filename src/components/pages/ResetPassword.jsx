import { useEffect } from 'react';

const ResetPassword = () => {
    useEffect(() => {
        const { ApperUI } = window.ApperSDK;
        ApperUI.showResetPassword('#authentication-reset-password');
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
            <div className="flex-1 py-12 px-5 flex justify-center items-center">
                <div id="authentication-reset-password" className="glass-card mx-auto w-[400px] max-w-full p-10 rounded-2xl premium-shadow"></div>
            </div>
        </div>
    );
};

export default ResetPassword;