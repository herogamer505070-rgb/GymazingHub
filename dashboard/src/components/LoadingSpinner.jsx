export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div
        className="w-8 h-8 rounded-full animate-spin"
        style={{
          border: "2px solid rgba(99,102,241,0.2)",
          borderTopColor: "#818cf8",
        }}
      />
    </div>
  );
}
