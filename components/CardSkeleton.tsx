import { Skeleton } from "./ui/skeleton";

export const CardSkelton = () => {
  return (
    <>
      <div className="flex flex-col space-y-3">
      <div className="flex flex-col space-y-3">
  <Skeleton className="h-[200px] w-full md:w-[300px] lg:w-[400px] rounded-xl flex flex-col space-y-7">
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-8 w-[70%] md:w-[60%] lg:w-[250px] mt-5 ml-4 md:ml-6" />
      <Skeleton className="h-20 w-[90%] md:w-[80%] lg:w-[300px] ml-4 md:ml-6" />
    </div>

    <Skeleton className="h-4 w-[30%] md:w-[20%] lg:w-[50px] ml-4 md:ml-6" />
  </Skeleton>
</div>

      </div>
    </>
  );
};
