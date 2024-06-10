import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';

export default function Page() {
  return (
    <SafeAreaView className="h-full m-4">
      <ScrollView>
        <Text className="text-lg font-bold">Recipea License</Text>
        <Text className="mt-4">Copyright (c) 2024 Szymon Grzesiak</Text>
        <Text className="mt-4">All rights reserved.</Text>
        <Text className="mt-4">
          Redistribution and use in source and binary forms, with or without
          modification, are not permitted without explicit permission from the
          author.
        </Text>
        <Text className="mt-4">
          THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER "AS IS" AND ANY
          EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
          IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
          PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
          LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
          CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
          SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
          BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
          WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
          OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
          EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
        </Text>
        <Text className="mt-4">
          For permission requests, please contact the author at
          32424@uniwersytetkaliski.edu.pl
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};