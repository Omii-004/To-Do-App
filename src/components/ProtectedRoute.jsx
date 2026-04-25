import { Show } from "@clerk/react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    return (
        <>
            <Show when="signed-in">{children}</Show>

            <Show when="signed-out">
                <Navigate to="/" replace />
            </Show>
        </>
    );
}
