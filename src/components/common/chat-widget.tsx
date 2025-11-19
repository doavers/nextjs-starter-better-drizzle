"use client";

import { MessageCircle, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export default function ChatWidget() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="bg-primary fixed right-7 bottom-20 z-999 h-12 w-12 rounded-full shadow-lg transition-transform hover:scale-110"
          aria-label="Open live chat"
        >
          <MessageCircle className="text-primary-foreground h-7 w-7" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mr-4 w-80" sideOffset={10}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Live Chat Support</h4>
            <p className="text-muted-foreground text-sm">How can we help you today?</p>
          </div>
          <Separator />
          <div className="flex h-64 flex-col space-y-4 overflow-y-auto p-2">
            <div className="flex items-start gap-2.5">
              <div className="border-border bg-muted flex w-full max-w-[320px] flex-col rounded-e-xl rounded-es-xl p-4 leading-1.5">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-foreground text-sm font-semibold">Support Agent</span>
                </div>
                <p className="text-foreground py-2.5 text-sm font-normal">
                  Hello! I&apos;m the Doavers assistant. How can I assist you with our services?
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
            <Input placeholder="Type your message..." className="pr-12" />
            <Button
              size="icon"
              variant="ghost"
              className="text-primary hover:text-primary absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
