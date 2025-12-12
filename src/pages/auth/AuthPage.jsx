import FloatingLines from "../../components/background/FloatingLines";
import AuthCard from "./AuthCard";

export default function LoginPage() {
  return (
    <div className="auth-wrapper fullscreen">

      <FloatingLines
        enabledWaves={['top', 'middle', 'bottom']}
        lineCount={[10, 15, 20]}
        lineDistance={[8, 6, 4]}
        bendRadius={5.0}
        bendStrength={-0.5}
        interactive={true}
        parallax={true}
        animationSpeed={1.2}
        mixBlendMode="screen"
      />

      <AuthCard />
    </div>
  );
}
