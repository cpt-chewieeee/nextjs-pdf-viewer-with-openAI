

export default function ChatHistoryList() {
  return (
    <div className="border border-white h-full flex-1 overflow-auto p-1 space-y-2 rounded border">

      {
        [0,1,2,3,4,5,6,7,8,9,10].map((item: number) => {
          return (
            <div key={item} className={`flex ${
              item % 3 === 0 ?  'justify-start' : 'justify-end'
            }`}>
              <div className={`max-w-xs px-4 py-2 rounded break-words ${
                item % 3 === 0 ? 'bg-blue-600 text-white' : 'bg-green-200 text-gray-800'
              }`}>
                <p>hello world</p>
                <span className="text-xs text-gray-400 block text-right mt-1">10/10/2025</span>
              </div>
            </div>
          );
        })
      }
    </div>
  )
}