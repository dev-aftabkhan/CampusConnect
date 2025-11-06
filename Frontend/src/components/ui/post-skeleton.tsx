import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PostSkeleton() {
  return (
    <Card className="w-full bg-card border border-border shadow-sm rounded-lg overflow-hidden">
      <CardHeader className="pb-4 px-6 pt-6">
        <div className="flex items-start space-x-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-4">
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
          
          {/* Random chance for image skeleton */}
          {Math.random() > 0.5 && (
            <Skeleton className="h-48 w-full rounded-lg mt-4" />
          )}
          
          {/* Tags skeleton */}
          <div className="flex space-x-2 mt-4">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
        </div>
      </CardContent>

      {/* Actions skeleton */}
      <div className="px-6 py-3 border-t border-border">
        <div className="flex items-center space-x-1">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
    </Card>
  )
}

export function PostSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  )
}