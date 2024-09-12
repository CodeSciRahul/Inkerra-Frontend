import { Skeleton } from "./ui/skeleton";

export const CardSkelton = () => {
  return (
    <>
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[200px] w-[400px] md:w-[300px] rounded-xl flex flex-col space-y-7">
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-8 w-[250px] md:w-[170px]  mt-5 ml-6" />
            <Skeleton className="h-20 w-[300px] md:w-[250px]  ml-6" />
          </div>

          <Skeleton className="h-4 w-[50px] ml-6" />
        </Skeleton>
      </div>
    </>
  );
};
