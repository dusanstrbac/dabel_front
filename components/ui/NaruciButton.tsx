"use client";
import { Button } from "./button";

const NaruciButton = ({ disabled, reason }: { disabled?: boolean; reason?: string }) => {

  console.log('status dugmeta', disabled);
  return (
    <div style={{ display: "inline-block" }}>
      <Button
        variant="outline"
        className="px-10 py-4 cursor-pointer"
        disabled={disabled}
      >
        Naruči
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
