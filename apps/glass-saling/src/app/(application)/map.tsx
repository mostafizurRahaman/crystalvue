const GoogleMap = () => {
  return (
    <section className="w-full h-[500px] md:h-[600px] lg:h-[700px] relative">
      <iframe
        src="https://www.google.com/maps/embed?pb=YOUR_EMBED_URL"
        className="absolute inset-0 w-full h-full border-0"
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </section>
  );
};

export default GoogleMap;
