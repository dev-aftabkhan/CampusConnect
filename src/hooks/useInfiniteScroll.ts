import { useState, useEffect, useCallback } from 'react'

interface UseInfiniteScrollProps {
  fetchMore: () => Promise<void>
  hasMore: boolean
  isLoading: boolean
}

export const useInfiniteScroll = ({ fetchMore, hasMore, isLoading }: UseInfiniteScrollProps) => {
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) {
        return
      }
      
      if (hasMore && !isLoading && !isFetching) {
        setIsFetching(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasMore, isLoading, isFetching])

  useEffect(() => {
    if (!isFetching) return

    const fetchData = async () => {
      try {
        await fetchMore()
      } finally {
        setIsFetching(false)
      }
    }

    fetchData()
  }, [isFetching, fetchMore])

  return { isFetching }
}