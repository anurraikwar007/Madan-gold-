const EmptyState = ({
  title = "No Data Found",
  subtitle = "Please try again later",
}) => {

  return (

    <div
      className="
        py-24
        text-center
      "
    >

      <h2
        className="
          text-2xl
          font-bold
          mb-3
        "
      >
        {title}
      </h2>

      <p className="text-gray-500">
        {subtitle}
      </p>

    </div>

  );
};

export default EmptyState;