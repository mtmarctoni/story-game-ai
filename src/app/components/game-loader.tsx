import { Loader } from "@/components/loader";
import { Message, MessageContent } from "@/components/message";

export function GameLoader() {
  return (
    <Message from="assistant">
      <MessageContent>
        <div className="flex items-center gap-2">
          <Loader />
          Cargando historia...
        </div>
      </MessageContent>
    </Message>
  );
}
