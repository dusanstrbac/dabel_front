"use client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "./button";

const NaruciButton = ({ disabled, reason }: { disabled?: boolean; reason?: string }) => {
  const router = useRouter();
  const t = useTranslations();

  const handleOrderClick = () => {
    if (!disabled) {
      router.push("/dokument/upis");
    }
  };

  return (
    <div style={{ display: "inline-block" }}>
      <Button
        variant="outline"
        className="px-10 py-4 cursor-pointer"
        disabled={disabled}
        onClick={handleOrderClick}  // Dodaj handler za klik
      >
        {t('korpa.naruci')}
      </Button>

      {disabled && reason && (
        <p style={{ color: "red", marginTop: 8, fontSize: 14 }}>
          {reason}
        </p>
      )}
    </div>
  );
};

export default NaruciButton;